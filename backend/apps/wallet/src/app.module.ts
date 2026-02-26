import { Module } from "@nestjs/common";
import { ApplicationModule } from "./application/application.module";
import { HttpModule } from "./http/http.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";

@Module({
  imports: [InfrastructureModule, ApplicationModule, HttpModule],
})
export class AppModule {}
