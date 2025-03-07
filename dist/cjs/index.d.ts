import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { BfpUpgradeableInstruction, CloseParams, DeployWithMaxDataLenParams, InitializeBufferParams, SetAuthorityParams, UpgradeParams, WriteParams } from "./types.js";
import * as Types from './types.js';
export declare const BPF_UPGRADEABLE_PROGRAM_ID: PublicKey;
export declare class BpfUpgradeableLoaderInstruction {
    static programId: PublicKey;
    static compareProgramId(a: PublicKey): void | Error;
    static decodeInstructionType(instruction: TransactionInstruction): BfpUpgradeableInstruction;
    static decodeInitializeBuffer(instruction: TransactionInstruction): InitializeBufferParams;
    static decodeWrite(instruction: TransactionInstruction): WriteParams;
    static decodeDeployWithMaxDataLen(instruction: TransactionInstruction): DeployWithMaxDataLenParams;
    static decodeUpgrade(instruction: TransactionInstruction): UpgradeParams;
    static decodeSetAuthority(instruction: TransactionInstruction): SetAuthorityParams;
    static decodeClose(instruction: TransactionInstruction): CloseParams;
}
export declare class BpfUpgradeableLoaderProgram {
    static programId: PublicKey;
    static initializeBuffer(params: InitializeBufferParams): TransactionInstruction;
    static write(params: WriteParams): TransactionInstruction;
    static deployWithMaxDataLen(params: DeployWithMaxDataLenParams): TransactionInstruction;
    static upgrade(params: UpgradeParams): TransactionInstruction;
    static setAuthority(params: SetAuthorityParams): TransactionInstruction;
    static close(params: CloseParams): TransactionInstruction;
}
export declare const types: typeof Types;
//# sourceMappingURL=index.d.ts.map