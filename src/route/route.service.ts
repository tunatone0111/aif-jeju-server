import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Coordinate } from './schema/Coordinate.schema';

const JEJU_OFFICE_COORD: Coordinate = {
  lat: 33.48928,
  lng: 126.49878,
};

@Injectable()
export class RouteService {
  baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('OSRM_URI');
  }

  async getDistanceBetween(
    start: Coordinate,
    end: Coordinate,
  ): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService.get<{
        routes: { distance: number }[];
      }>(
        this.baseUrl +
          `/route/v1/driving/${start.toString()};${end.toString()}`,
      ),
    );

    return data.routes[0].distance;
  }

  async getDistanceMatrix(coords: Coordinate[]): Promise<number[][]> {
    if (coords.length > 10) {
      throw new Error('최대 10개의 좌표만 입력 가능합니다.');
    }

    const { data } = await firstValueFrom(
      this.httpService.get<{
        durations: number[][];
      }>(
        this.baseUrl +
          `/table/v1/driving/${JEJU_OFFICE_COORD.toString()};${coords
            .map((coord) => coord.toString())
            .join(';')}`,
      ),
    );

    return data.durations;
  }

  solveTSP(distances: number[][]): number[] {
    const numNodes = distances.length;

    // memo 배열 초기화
    const memo: { distance: number; order: number[] }[][] = Array.from(
      { length: 1 << numNodes },
      () => Array(numNodes).fill({ distance: -1, order: [] }),
    );

    // 경로를 나타내는 비트마스크 방식 사용
    const allNodes = (1 << numNodes) - 1;

    function dp(
      mask: number,
      pos: number,
    ): { distance: number; order: number[] } {
      // 모든 노드를 방문한 경우, 출발 노드로 되돌아가는 거리 반환
      if (mask === allNodes) {
        return { distance: distances[pos][0], order: [0] };
      }

      // 이미 계산한 값이 있다면 반환
      if (memo[mask][pos].distance !== -1) {
        return memo[mask][pos];
      }

      let minDistance = Infinity;
      let bestOrder: number[] = [];

      // 모든 노드를 순회하면서 최소 거리 찾기
      for (let nextNode = 0; nextNode < numNodes; nextNode++) {
        // nextNode가 이미 방문한 노드인지 확인
        if ((mask & (1 << nextNode)) === 0) {
          const newMask = mask | (1 << nextNode);
          const { distance, order } = dp(newMask, nextNode);
          const newDistance = distances[pos][nextNode] + distance;

          if (newDistance < minDistance) {
            minDistance = newDistance;
            bestOrder = [pos, ...order];
          }
        }
      }

      // 계산한 최소 거리와 방문 순서를 memo에 저장하고 반환
      memo[mask][pos] = { distance: minDistance, order: bestOrder };
      return memo[mask][pos];
    }

    // 시작 노드는 0으로 고정
    return dp(1, 0).order;
  }
}
