/*
Copyright 2017, 2018 matrix-appservice-discord

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

import { DiscordStore } from "../store";
import { IDbDataMany } from "./dbdatainterface";
import { ISqlCommandParameters } from "./connector";

export class DbReaction implements IDbDataMany {
    public MatrixId: string;
    public MessageId: string;
    public ChannelId: string;
    public UserId: string;
    public Emoji: string;
    public Result: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private rows: any[];

    get ResultCount(): number {
        return this.rows.length;
    }

    public async RunQuery(store: DiscordStore, params: ISqlCommandParameters): Promise<void> {
        let query: string;

        if (params.message_id && params.user_id && params.emoji) {
            query = `
                SELECT *
                FROM discord_reactions_store
                WHERE message_id = $message_id AND user_id = $user_id AND emoji = $emoji`;
        } else if (params.matrix_id) {
            query = `
                SELECT *
                FROM discord_reactions_store
                WHERE matrix_id = $matrix_id`;
        } else {
            throw new Error("Unknown/incorrect parameters");
        }

        this.rows = await store.db.All(query, {
            matrix_id: params.matrix_id,
            message_id: params.message_id,
            user_id: params.user_id,
            emoji: params.emoji
        });

        this.Result = this.rows.length !== 0;
    }

    public Next(): boolean {
        if (!this.Result || this.ResultCount === 0) {
            return false;
        }
        const item = this.rows.shift();
        this.MatrixId = item.matrix_id as string;
        this.MessageId = item.message_id as string;
        this.ChannelId = item.channel_id as string;
        this.UserId = item.user_id as string;
        this.Emoji = item.emoji as string;
        return true;
    }

    public async Insert(store: DiscordStore): Promise<void> {
        await store.db.Run(`
            INSERT INTO discord_reactions_store
            (matrix_id,message_id,channel_id,user_id,emoji)
            VALUES ($matrix_id,$message_id,$channel_id,$user_id,$emoji);`, {
            /* eslint-disable @typescript-eslint/naming-convention */
            matrix_id: this.MatrixId,
            message_id: this.MessageId,
            channel_id: this.ChannelId,
            user_id: this.UserId,
            emoji: this.Emoji,
            /* eslint-enable @typescript-eslint/naming-convention */
        });
    }

    public async Update(store: DiscordStore): Promise<void> {
        throw new Error("Update is not implemented");
    }

    public async Delete(store: DiscordStore): Promise<void> {
        await store.db.Run(`
            DELETE FROM discord_reactions_store
            WHERE matrix_id = $matrix_id`, {
            /* eslint-disable @typescript-eslint/naming-convention */
            matrix_id: this.MatrixId,
            /* eslint-enable @typescript-eslint/naming-convention */
        });
    }
}
