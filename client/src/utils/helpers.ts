function truncateAddress(address:any, length = 6) {
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

export {
    truncateAddress
}