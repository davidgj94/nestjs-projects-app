import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuthenticationEntity } from '../entities';
import { AuthenticationProvider } from '../providers';

@EventSubscriber()
export class AuthenticationSubscriber
  implements EntitySubscriberInterface<AuthenticationEntity>
{
  listenTo() {
    return AuthenticationEntity;
  }

  public async beforeInsert({
    entity,
  }: InsertEvent<AuthenticationEntity>): Promise<void> {
    entity.password = await AuthenticationProvider.generateHash(
      entity.password,
    );
  }

  public async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<AuthenticationEntity>): Promise<void> {
    if (
      entity?.password &&
      !(await AuthenticationProvider.compareHash(
        entity.password,
        databaseEntity.password,
      ))
    )
      entity.password = await AuthenticationProvider.generateHash(
        entity.password,
      );
  }
}
