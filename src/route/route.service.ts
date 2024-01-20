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
    this.baseUrl = this.configService.get<string>('OSRM_URI')!;
  }

  async getDistanceFromOffice(coord: Coordinate): Promise<number> {
    return await this.getDistanceBetween(JEJU_OFFICE_COORD, coord);
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
          `/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}`,
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
          `/table/v1/driving/${JEJU_OFFICE_COORD.lng},${
            JEJU_OFFICE_COORD.lat
          };${coords.map((coord) => `${coord.lng},${coord.lat}`).join(';')}`,
      ),
    );

    return data.durations;
  }

  // it returns the order of the list
  solveTSP(distanceMatrix: number[][]): number[] {
    const n = distanceMatrix.length;
    const dp = Array.from(Array(n), () => Array(1 << n).fill(-1));
    const path = Array.from(Array(n), () => Array(1 << n).fill(-1));

    const tsp = (cur: number, visited: number): number => {
      if (visited === (1 << n) - 1) {
        return 0;
      }

      if (dp[cur][visited] !== -1) {
        return dp[cur][visited];
      }

      dp[cur][visited] = Infinity;

      for (let i = 0; i < n; i++) {
        if (visited & (1 << i)) {
          continue;
        }

        const candidate = distanceMatrix[cur][i] + tsp(i, visited | (1 << i));

        if (candidate < dp[cur][visited]) {
          dp[cur][visited] = candidate;
          path[cur][visited] = i;
        }
      }

      return dp[cur][visited];
    };

    tsp(0, 1);

    const res = [];
    let cur = 0;
    let visited = 1;

    while (path[cur][visited] !== -1) {
      res.push(path[cur][visited]);
      const next = path[cur][visited];
      visited |= 1 << next;
      cur = next;
    }

    return res;
  }
}
