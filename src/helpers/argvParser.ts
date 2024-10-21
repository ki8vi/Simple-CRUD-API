export const isMultiMode = () => {
    const args = process.argv.slice(2);
    const multiArg = args.find((arg) => arg.startsWith('--multi'));
    
    return multiArg === '--multi' || multiArg === '--multi=true';
};