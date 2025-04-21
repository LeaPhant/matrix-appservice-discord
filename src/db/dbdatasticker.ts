/*
Copyright 2017 - 2019 matrix-appservice-discord

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
import { IDbData } from "./dbdatainterface";
import { ISqlCommandParameters } from "./connector";

export class DbSticker implements IDbData {
    public StickerId: string;
    public Name: string;
    public Type: string;
    public MxcUrl: string;
    public CreatedAt: number;
    public UpdatedAt: number;
    public Result: boolean;

    public async RunQuery(store: DiscordStore, params: ISqlCommandParameters): Promise<void> {
        let query = `
            SELECT *
            FROM sticker
            WHERE sticker_id = $id`;
        if (params.mxc_url) {
            query = `
                SELECT *
                FROM sticker
                WHERE mxc_url = $mxc`;
        }
        const row = await store.db.Get(query, {
            id: params.sticker_id,
            mxc: params.mxc_url,
        });
        this.Result = Boolean(row); // check if row exists
        if (this.Result && row) {
            this.StickerId = row.emoji_id as string;
            this.Name = row.name as string;
            this.Type = row.type as string;
            this.MxcUrl = row.mxc_url as string;
            this.CreatedAt = row.created_at as number;
            this.UpdatedAt = row.updated_at as number;
        }
    }

    public async Insert(store: DiscordStore): Promise<void> {
        this.CreatedAt = new Date().getTime();
        this.UpdatedAt = this.CreatedAt;
        await store.db.Run(`
            INSERT INTO sticker
            (sticker_id,name,type,mxc_url,created_at,updated_at)
            VALUES ($sticker_id,$type,$type,$mxc_url,$created_at,$updated_at);`, {
            /* eslint-disable @typescript-eslint/naming-convention */
            sticker_id: this.StickerId,
            type: this.Type,
            created_at: this.CreatedAt,
            mxc_url: this.MxcUrl,
            name: this.Name,
            updated_at: this.UpdatedAt,
            /* eslint-enable @typescript-eslint/naming-convention */
        });
    }

    public async Update(store: DiscordStore): Promise<void> {
        // Ensure this has incremented by 1 for Insert+Update operations.
        this.UpdatedAt = new Date().getTime() + 1;
        await store.db.Run(`
            UPDATE sticker
            SET name = $name,
            type = $type,
            mxc_url = $mxc_url,
            updated_at = $updated_at
            WHERE
            sticker_id = $sticker_id`, {
            /* eslint-disable @typescript-eslint/naming-convention */
            type: this.Type,
            sticker_id: this.StickerId,
            mxc_url: this.MxcUrl,
            name: this.Name,
            updated_at: this.UpdatedAt,
            /* eslint-enable @typescript-eslint/naming-convention */
        });
    }

    public async Delete(store: DiscordStore): Promise<void> {
        throw new Error("Delete is not implemented");
    }
}
