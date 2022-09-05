export const Environments = <const>['dev', 'test', 'staging'];
export type Environments = typeof Environments[number];

export const isTestEnv = (process.env.NODE_ENV as Environments) === 'test';
export const isDevEnv = (process.env.NODE_ENV as Environments) === 'dev';
console.log(process.env.NODE_ENV);
