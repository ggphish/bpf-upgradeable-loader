import {PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, TransactionInstruction} from "@solana/web3.js";
import {BfpUpgradeableInstruction, BfpUpgradeableOpCodes, CloseParams, DeployWithMaxDataLenParams, InitializeBufferParams, OpCodesMapInvert, SetAuthorityParams, UpgradeParams, WriteParams} from "./types.js";
import * as Types from './types.js';
import {Buffer} from "buffer";

export const BPF_UPGRADEABLE_PROGRAM_ID: PublicKey = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");

export class BpfUpgradeableLoaderInstruction {
    public static programId: PublicKey = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");

    public static compareProgramId (a: PublicKey): void | Error {
        if (!a.equals(this.programId)) {
            throw new Error("This not BpfUpgradeable instruction");
        }
    }

    public static decodeInstructionType (instruction: TransactionInstruction): BfpUpgradeableInstruction {
        this.compareProgramId(instruction.programId);

        const opCode = instruction.data.readUint32LE(0);

        return OpCodesMapInvert[opCode as BfpUpgradeableOpCodes];
    }

    public static decodeInitializeBuffer (instruction: TransactionInstruction): InitializeBufferParams {
        this.compareProgramId(instruction.programId);

        const opCode = this.decodeInstructionType(instruction);

        if (opCode !== "InitializeBuffer") {
            throw new Error("Instruction not InitializeBuffer");
        }

        return {
            write: instruction.keys[0].pubkey,
            authority: instruction.keys[1].pubkey
        } as InitializeBufferParams;
    }

    public static decodeWrite (instruction: TransactionInstruction): WriteParams {
        this.compareProgramId(instruction.programId);

        const opCode = this.decodeInstructionType(instruction);

        if (opCode !== "Write") {
            throw new Error("Instruction not Write");
        }

        const offset = instruction.data.readUint32LE(4);
        const data = instruction.data.slice(16, instruction.data.length);

        return {
            write: instruction.keys[0].pubkey,
            authority: instruction.keys[1].pubkey,
            offset,
            data,
        } as WriteParams;
    }

    public static decodeDeployWithMaxDataLen (instruction: TransactionInstruction): DeployWithMaxDataLenParams {
        this.compareProgramId(instruction.programId);

        const opCode = this.decodeInstructionType(instruction);

        if (opCode !== "DeployWithMaxDataLen") {
            throw new Error("Instruction not DeployWithMaxDataLen");
        }

        const maxDataLen = instruction.data.readBigUInt64LE(4);

        return {
            payer: instruction.keys[0].pubkey,
            programData: instruction.keys[1].pubkey,
            program: instruction.keys[2].pubkey,
            bufferAccount: instruction.keys[3].pubkey,
            authority: instruction.keys[7].pubkey,
            maxDataLen
        } as DeployWithMaxDataLenParams;
    }

    public static decodeUpgrade (instruction: TransactionInstruction): UpgradeParams {
        this.compareProgramId(instruction.programId);

        const opCode = this.decodeInstructionType(instruction);

        if (opCode !== "Upgrade") {
            throw new Error("Instruction not Upgrade");
        }

        return {
            programData: instruction.keys[0].pubkey,
            program: instruction.keys[1].pubkey,
            bufferAccount: instruction.keys[2].pubkey,
            spillAccount: instruction.keys[3].pubkey,
            authority: instruction.keys[6].pubkey,
        } as UpgradeParams;
    }

    public static decodeSetAuthority (instruction: TransactionInstruction): SetAuthorityParams {
        this.compareProgramId(instruction.programId);

        const opCode = this.decodeInstructionType(instruction);

        if (opCode !== "SetAuthority") {
            throw new Error("Instruction not SetAuthority");
        }

        return {
            account: instruction.keys[0].pubkey,
            currentAuthority: instruction.keys[1].pubkey,
            newAuthority: instruction.keys[2] ? instruction.keys[2].pubkey : null,
        } as SetAuthorityParams;
    }

    public static decodeClose (instruction: TransactionInstruction): CloseParams {
        this.compareProgramId(instruction.programId);

        const opCode = this.decodeInstructionType(instruction);

        if (opCode !== "Close") {
            throw new Error("Instruction not Close");
        }

        return {
            account: instruction.keys[0].pubkey,
            authority: instruction.keys[1].pubkey,
            destination: instruction.keys[2].pubkey,
            programData: instruction.keys[3].pubkey,
        } as CloseParams;
    }
}

export class BpfUpgradeableLoaderProgram {
    public static programId: PublicKey = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");

    public static initializeBuffer (params: InitializeBufferParams): TransactionInstruction {
        const instruction: Buffer = Buffer.alloc(4);
        instruction.writeUInt32LE(0, 0);

        return new TransactionInstruction({
            keys: [
                {pubkey: params.write, isSigner: true, isWritable: true},
                {pubkey: params.authority, isSigner: true, isWritable: true},
            ],
            programId: this.programId,
            data: instruction
        });
    }

    public static write (params: WriteParams): TransactionInstruction {
        const instruction: Buffer = Buffer.alloc(16);
        instruction.writeUInt32LE(1, 0);
        instruction.writeUInt32LE(params.offset, 4);
        instruction.writeUInt32LE(params.data.length, 8);
        instruction.writeUInt32LE(0, 12);

        return new TransactionInstruction({
            keys: [
                {pubkey: params.write, isSigner: true, isWritable: true},
                {pubkey: params.authority, isSigner: true, isWritable: true},
            ],
            programId: this.programId,
            data: instruction
        });
    }

    public static deployWithMaxDataLen (params: DeployWithMaxDataLenParams): TransactionInstruction {
        const instruction: Buffer = Buffer.alloc(12);
        instruction.writeUInt32LE(2, 0);
        instruction.writeBigUInt64LE(params.maxDataLen, 4);

        return new TransactionInstruction({
            keys: [
                {pubkey: params.payer, isSigner: true, isWritable: true},
                {pubkey: params.programData, isSigner: false, isWritable: true},
                {pubkey: params.program, isSigner: true, isWritable: true},
                {pubkey: params.bufferAccount, isSigner: false, isWritable: true},
                {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
                {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
                {pubkey: params.authority, isSigner: true, isWritable: true},
            ],
            programId: this.programId,
            data: instruction
        });
    }

    public static upgrade (params: UpgradeParams): TransactionInstruction {
        const instruction: Buffer = Buffer.alloc(4);
        instruction.writeUInt32LE(3, 0);

        return new TransactionInstruction({
            keys: [
                {pubkey: params.programData, isSigner: false, isWritable: true},
                {pubkey: params.program, isSigner: false, isWritable: true},
                {pubkey: params.bufferAccount, isSigner: false, isWritable: true},
                {pubkey: params.spillAccount, isSigner: true, isWritable: true},
                {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
                {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
                {pubkey: params.authority, isSigner: true, isWritable: true},
            ],
            programId: this.programId,
            data: instruction
        });
    }

    public static setAuthority (params: SetAuthorityParams): TransactionInstruction {
        const instruction: Buffer = Buffer.alloc(4);
        instruction.writeUInt32LE(4, 0);

        const keys = [
            {pubkey: params.account, isSigner: false, isWritable: true},
            {pubkey: params.currentAuthority, isSigner: true, isWritable: true},
        ];

        if (params.newAuthority) {
            keys.push({pubkey: params.newAuthority, isSigner: false, isWritable: true},)
        }

        return new TransactionInstruction({
            keys,
            programId: this.programId,
            data: instruction
        });
    }

    public static close (params: CloseParams): TransactionInstruction {
        const instruction: Buffer = Buffer.alloc(4);
        instruction.writeUInt32LE(5, 0);

        return new TransactionInstruction({
            keys: [
                {pubkey: params.account, isSigner: false, isWritable: true},
                {pubkey: params.authority, isSigner: true, isWritable: true},
                {pubkey: params.destination, isSigner: true, isWritable: true},
                {pubkey: params.programData, isSigner: false, isWritable: true},
            ],
            programId: this.programId,
            data: instruction
        });
    }
}

export const types = Types;