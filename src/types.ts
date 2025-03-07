import {PublicKey} from "@solana/web3.js";

export type BfpUpgradeableInstruction = "InitializeBuffer"
    | "Write"
    | "DeployWithMaxDataLen"
    | "Upgrade"
    | "SetAuthority"
    | "Close";

export type BfpUpgradeableOpCodes = 0 | 1 | 2 | 3 | 4 | 5;

export type BfpUpgradeableOpCodesMap = Record<BfpUpgradeableInstruction, BfpUpgradeableOpCodes>;

export const OpCodesMap: BfpUpgradeableOpCodesMap = {
    InitializeBuffer: 0,
    Write: 1,
    DeployWithMaxDataLen: 2,
    Upgrade: 3,
    SetAuthority: 4,
    Close: 5
};

export type BfpUpgradeableOpCodesMapInvert = Record<BfpUpgradeableOpCodes, BfpUpgradeableInstruction>;

export const OpCodesMapInvert: BfpUpgradeableOpCodesMapInvert = {
    0: "InitializeBuffer",
    1: "Write",
    2: "DeployWithMaxDataLen",
    3: "Upgrade",
    4: "SetAuthority",
    5: "Close"
};

export interface InitializeBufferParams {
    write: PublicKey,
    authority: PublicKey
}

export interface WriteParams {
    write: PublicKey,
    authority: PublicKey,
    offset: number,
    data: Buffer
}

export interface DeployWithMaxDataLenParams {
    payer: PublicKey,
    programData: PublicKey,
    program: PublicKey,
    bufferAccount: PublicKey,
    authority: PublicKey,
    maxDataLen: bigint,
}

export interface UpgradeParams {
    programData: PublicKey,
    program: PublicKey,
    bufferAccount: PublicKey,
    spillAccount: PublicKey,
    authority: PublicKey
}

export interface SetAuthorityParams {
    account: PublicKey,
    currentAuthority: PublicKey,
    newAuthority: PublicKey | null
}

export interface CloseParams {
    account: PublicKey,
    authority: PublicKey,
    destination: PublicKey,
    programData: PublicKey
}