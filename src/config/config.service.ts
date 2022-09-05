import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  databaseConfiguration,
  jwtConfiguration,
  serverConfiguration,
} from './config.namespaces';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject(databaseConfiguration.KEY)
    public dbConfig: ConfigType<typeof databaseConfiguration>,
    @Inject(serverConfiguration.KEY)
    public serverConfig: ConfigType<typeof serverConfiguration>,
    @Inject(jwtConfiguration.KEY)
    public jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}
}
