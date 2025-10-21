import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { SleeperService } from './sleeper.service'

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [SleeperService],
    exports: []
})
export class SleeperModule {}