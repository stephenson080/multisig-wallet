export interface WalletDetails {
    name: string,
    approvals: string[]
    address: string
    balance: number
}

export interface Inputs {
    name: string,
    type: 'string' | 'number' | 'array' | 'bool' | 'unknown'
}

export interface AbiInput {
    name: string,
    inputs: Inputs[]
}

export interface Transaction {
    id: number;
    data: string;
    to: string;
    approvals: any;
    executed: boolean;
}