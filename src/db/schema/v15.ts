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

const log = new Log("SchemaV15");

export class Schema implements IDbSchema {
    public description = "create discord_reactions_store table";
    public async run(store: DiscordStore): Promise<void> {
        await store.createTable(`
            CREATE TABLE discord_reactions_store (
                matrix_id TEXT NOT NULL,
                message_id TEXT NOT NULL,
                channel_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                emoji TEXT NOT NULL,
                PRIMARY KEY(matrix_id)
        );`, "discord_reactions_store");
    }

    public async rollBack(store: DiscordStore): Promise<void> {
        await store.db.Run(
            `DROP TABLE IF EXISTS discord_reactions_store;`,
        );
    }
}
