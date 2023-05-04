type AsyncFunction<T> = (...args: any[]) => Promise<T>;

function asyncWrapper<T>(fn: AsyncFunction<T>): AsyncFunction<T> {
    return async function wrappedFunction(...args: any[]): Promise<T> {
        try {
            const result = await fn(...args);
            return result;
        } catch (error) {
            // handle the error
            console.error('Error in async function:', error);
            throw error;
        }
    };
}

export default asyncWrapper;

export {
    asyncWrapper
}