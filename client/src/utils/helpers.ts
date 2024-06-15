import EXTERNAlCONTRACTABI from '../abi/ExternalContract.json'
import { AbiInput, Inputs } from './type';
export function truncateAddress(address:any, length = 6) {
    if (!address || typeof address !== 'string') {
        return
    }
    if (length >= address.length) {
        return address;
    }
    const prefix = address.slice(0, length);
    const suffix = address.slice(-length);
    return `${prefix}...${suffix}`;
}

export function abiToFunction(ABI?: any){
    const abi = !ABI ? [...EXTERNAlCONTRACTABI.abi] : [...ABI]
    const functions : AbiInput[] = []
    for (let a of abi){
        if (a.type === 'function' && a.stateMutability !== 'view' ){
            const name = a.name ? a.name : 'Unknown'
            const inputs : Inputs[] = []
            if (a.inputs && a.inputs.length > 0){
                for (let inp of a.inputs){
                    const type = mapSolidityType(inp.type)
                    inputs.push({name: inp.name, type: type})
                }
                
            }
            const abiInput : AbiInput = {
                name,
                inputs
            }
            functions.push(abiInput)
        }
    }
    return functions
}

function mapSolidityType(solidityType: any) {
    // Check if the type is a number
    if (solidityType.match(/^(uint|int)([0-9]*)$/)) {
        return 'number';
    }
    // Check if the type is a string (including address and bytes)
    if (solidityType === 'string' || solidityType === 'address' || solidityType.match(/^bytes([0-9]*)$/)) {
        return 'string';
    }

    if (solidityType === 'bool') {
        return 'bool';
    }
    // Check if the type is an array (dynamic or fixed-size)
    if (solidityType.match(/(.*)\[.*\]$/)) {
        return 'array';
    }
  
    return 'unknown';
}
