"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.BpfUpgradeableLoaderProgram = exports.BpfUpgradeableLoaderInstruction = exports.BPF_UPGRADEABLE_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_js_1 = require("./types.js");
const Types = __importStar(require("./types.js"));
const buffer_1 = require("buffer");
exports.BPF_UPGRADEABLE_PROGRAM_ID = new web3_js_1.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
class BpfUpgradeableLoaderInstruction {
    static programId = new web3_js_1.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
    static compareProgramId(a) {
        if (!a.equals(this.programId)) {
            throw new Error("This not BpfUpgradeable instruction");
        }
    }
    static decodeInstructionType(instruction) {
        this.compareProgramId(instruction.programId);
        const opCode = instruction.data.readUint32LE(0);
        return types_js_1.OpCodesMapInvert[opCode];
    }
    static decodeInitializeBuffer(instruction) {
        this.compareProgramId(instruction.programId);
        const opCode = this.decodeInstructionType(instruction);
        if (opCode !== "InitializeBuffer") {
            throw new Error("Instruction not InitializeBuffer");
        }
        return {
            write: instruction.keys[0].pubkey,
            authority: instruction.keys[1].pubkey
        };
    }
    static decodeWrite(instruction) {
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
        };
    }
    static decodeDeployWithMaxDataLen(instruction) {
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
        };
    }
    static decodeUpgrade(instruction) {
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
        };
    }
    static decodeSetAuthority(instruction) {
        this.compareProgramId(instruction.programId);
        const opCode = this.decodeInstructionType(instruction);
        if (opCode !== "SetAuthority") {
            throw new Error("Instruction not SetAuthority");
        }
        return {
            account: instruction.keys[0].pubkey,
            currentAuthority: instruction.keys[1].pubkey,
            newAuthority: instruction.keys[2] ? instruction.keys[2].pubkey : null,
        };
    }
    static decodeClose(instruction) {
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
        };
    }
}
exports.BpfUpgradeableLoaderInstruction = BpfUpgradeableLoaderInstruction;
class BpfUpgradeableLoaderProgram {
    static programId = new web3_js_1.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
    static initializeBuffer(params) {
        const instruction = buffer_1.Buffer.alloc(4);
        instruction.writeUInt32LE(0, 0);
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.write, isSigner: true, isWritable: true },
                { pubkey: params.authority, isSigner: true, isWritable: true },
            ],
            programId: this.programId,
            data: instruction
        });
    }
    static write(params) {
        const instruction = buffer_1.Buffer.alloc(16);
        instruction.writeUInt32LE(1, 0);
        instruction.writeUInt32LE(params.offset, 4);
        instruction.writeUInt32LE(params.data.length, 8);
        instruction.writeUInt32LE(0, 12);
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.write, isSigner: true, isWritable: true },
                { pubkey: params.authority, isSigner: true, isWritable: true },
            ],
            programId: this.programId,
            data: instruction
        });
    }
    static deployWithMaxDataLen(params) {
        const instruction = buffer_1.Buffer.alloc(12);
        instruction.writeUInt32LE(2, 0);
        instruction.writeBigUInt64LE(params.maxDataLen, 4);
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.payer, isSigner: true, isWritable: true },
                { pubkey: params.programData, isSigner: false, isWritable: true },
                { pubkey: params.program, isSigner: true, isWritable: true },
                { pubkey: params.bufferAccount, isSigner: false, isWritable: true },
                { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
                { pubkey: params.authority, isSigner: true, isWritable: true },
            ],
            programId: this.programId,
            data: instruction
        });
    }
    static upgrade(params) {
        const instruction = buffer_1.Buffer.alloc(4);
        instruction.writeUInt32LE(3, 0);
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.programData, isSigner: false, isWritable: true },
                { pubkey: params.program, isSigner: false, isWritable: true },
                { pubkey: params.bufferAccount, isSigner: false, isWritable: true },
                { pubkey: params.spillAccount, isSigner: true, isWritable: true },
                { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                { pubkey: params.authority, isSigner: true, isWritable: true },
            ],
            programId: this.programId,
            data: instruction
        });
    }
    static setAuthority(params) {
        const instruction = buffer_1.Buffer.alloc(4);
        instruction.writeUInt32LE(4, 0);
        const keys = [
            { pubkey: params.account, isSigner: false, isWritable: true },
            { pubkey: params.currentAuthority, isSigner: true, isWritable: true },
        ];
        if (params.newAuthority) {
            keys.push({ pubkey: params.newAuthority, isSigner: false, isWritable: true });
        }
        return new web3_js_1.TransactionInstruction({
            keys,
            programId: this.programId,
            data: instruction
        });
    }
    static close(params) {
        const instruction = buffer_1.Buffer.alloc(4);
        instruction.writeUInt32LE(5, 0);
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.account, isSigner: false, isWritable: true },
                { pubkey: params.authority, isSigner: true, isWritable: true },
                { pubkey: params.destination, isSigner: true, isWritable: true },
                { pubkey: params.programData, isSigner: false, isWritable: true },
            ],
            programId: this.programId,
            data: instruction
        });
    }
}
exports.BpfUpgradeableLoaderProgram = BpfUpgradeableLoaderProgram;
exports.types = Types;
