/*
Copyright 2018 matrix-appservice-discord

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {IDbSchema} from "./dbschema";
import {DiscordStore} from "../../store";
import { Log } from "../../log";

const log = new Log("SchemaV13");

export class Schema implements IDbSchema {
    public description = "create guild sticker table";
    public async run(store: DiscordStore): Promise<void> {
        await store.createTable(`
            CREATE TABLE sticker (
                sticker_id TEXT NOT NULL,
                name TEXT NOT NULL,
                lottie INTEGER NOT NULL,
                mxc_url TEXT NOT NULL,
                created_at BIGINT NOT NULL,
                updated_at BIGINT NOT NULL,
                PRIMARY KEY(sticker_id)
        );`, "sticker");
    }

    public async rollBack(store: DiscordStore): Promise<void> {
        await store.db.Run(
            `DROP TABLE IF EXISTS sticker;`,
        );
    }
}
