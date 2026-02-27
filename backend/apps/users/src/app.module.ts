import { Module } from "@nestjs/common";
import { ConfigModule } from "./infrastructure/config/config.module";
import { PersistenceModule } from "./infrastructure/persistence/persistence.module";

@Module({
  imports: [ConfigModule, PersistenceModule],
})
export class AppModule {}
