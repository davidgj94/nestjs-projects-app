import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { appGuards, useGlobals } from 'src/app.helpers';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';

export const bootstrapControllerTest = async (
  controller: any,
  mockedProviders: { provide: any; useValue: any }[],
  additionalProviders: any[] = [],
  additionalImports: any[] = [],
) => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      AppConfigModule,
      PassportModule,
      JwtModule.registerAsync({
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) => ({
          ...configService.jwtConfig,
        }),
      }),
      ...additionalImports,
    ],
    controllers: [controller],
    providers: [
      JwtService,
      JwtStrategy,
      ...additionalProviders,
      ...mockedProviders,
      ...appGuards(),
    ],
  }).compile();
  const app = moduleRef.createNestApplication();
  useGlobals(app);
  await app.init();
  return app;
};
