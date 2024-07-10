export const wrapAsync = (handler: Function) => async (event: any, context: any) => {
  try {
    return await handler(event, context);
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    console.error(error);
    throw new Error('Error occurred');
  }
};
