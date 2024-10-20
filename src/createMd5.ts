import { createMD5 } from "hash-wasm/dist/md5.umd.min.js";
import type { IDataType } from "hash-wasm/dist/lib/util";
import type { IHasher } from "hash-wasm/dist/lib/WASMInterface";

type HashingMessageType =
    | "READY"
    | "UPDATE"
    | "DIGEST"
    | "DIGEST_RESULT"
    | "ERROR"
;

interface HashingMessage {
    type: HashingMessageType;
    summary?: string;
    data?: IDataType;

};

type HashingEvent = MessageEvent<HashingMessage>;

const postHashingMessage = (message: HashingMessage) => postMessage(message);

const createOnMessageHandler = () => {
    let md5: IHasher | undefined;

    const initializeMd5 = async () => {
        md5 = await createMD5();
        postHashingMessage({
            type: "READY",
        });
    };

    initializeMd5();

    const onMessage = async ({ data }: HashingEvent) => {
        if (md5 === undefined) {
            postHashingMessage({
                type: "ERROR",
                summary: "Tried to handle message before initialization complete.",
            });
            return;
        }

        if (data.type === "UPDATE") {
            if (data.data === undefined) {
                postHashingMessage({
                    type: "ERROR",
                    summary: "Data must be provided when doing UPDATE.",
                });
                return;
            }
    
            try {
                md5.update(data.data);
            } catch (error) {
                postHashingMessage({
                    type: "ERROR",
                    summary: `${error}`,
                });
            }
        } else if (data.type === "DIGEST") {
            try {
                const digest = md5.digest();

                postHashingMessage({
                    type: "DIGEST_RESULT",
                    data: digest,
                });
            } catch (error) {
                postHashingMessage({
                    type: "ERROR",
                    summary: `${error}`,
                });
            }
        }
    };

    return onMessage;
};


export default createOnMessageHandler();
