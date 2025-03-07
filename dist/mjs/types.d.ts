import { PublicKey } from "@solana/web3.js";
export type BfpUpgradeableInstruction = "InitializeBuffer" | "Write" | "DeployWithMaxDataLen" | "Upgrade" | "SetAuthority" | "Close";
export type BfpUpgradeableOpCodes = 0 | 1 | 2 | 3 | 4 | 5;
export type BfpUpgradeableOpCodesMap = Record<BfpUpgradeableInstruction, BfpUpgradeableOpCodes>;
export declare const OpCodesMap: BfpUpgradeableOpCodesMap;
export type BfpUpgradeableOpCodesMapInvert = Record<BfpUpgradeableOpCodes, BfpUpgradeableInstruction>;
export declare const OpCodesMapInvert: BfpUpgradeableOpCodesMapInvert;
export interface InitializeBufferParams {
    write: PublicKey;
    authority: PublicKey;
}
export interface WriteParams {
    write: PublicKey;
    authority: PublicKey;
    offset: number;
    data: Buffer;
}
export interface DeployWithMaxDataLenParams {
    payer: PublicKey;
    programData: PublicKey;
    program: PublicKey;
    bufferAccount: PublicKey;
    authority: PublicKey;
    maxDataLen: bigint;
}
export interface UpgradeParams {
    programData: PublicKey;
    program: PublicKey;
    bufferAccount: PublicKey;
    spillAccount: PublicKey;
    authority: PublicKey;
}
export interface SetAuthorityParams {
    account: PublicKey;
    currentAuthority: PublicKey;
    newAuthority: PublicKey | null;
}
export interface CloseParams {
    account: PublicKey;
    authority: PublicKey;
    destination: PublicKey;
    programData: PublicKey;
}
//# sourceMappingURL=types.d.ts.map