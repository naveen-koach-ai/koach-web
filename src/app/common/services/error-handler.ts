
export class AppError{
    message: string = '';
    statusCode: number;
    constructor(error: object, errorCode: number){
        console.log('Error object:', error);
        this.statusCode = errorCode;
        this.parseErrorMessage(error);
    };
    private parseErrorMessage(error: any){
        if (typeof error === 'object') {
            if (error.code === 'VALIDATAION_ERROR' && Array.isArray(error.err)) {
             const messages: string[] = [];
             for (const validationError of error.err) {
                 if (validationError.msg) {
                     messages.push(validationError.msg);
                 }
             }
              this.message = messages.join('\n');
            }
            else {
              this.message = error.message;
            }
        }
        else if (error.message && typeof error.message === 'string') {
            this.message = error.message;
        }
        else if (typeof(error) === 'string') {
            this.message = error;
        }
        else if (error && error.length) {
            error.forEach((err: any) => {
                this.message += err;
            });
        }
    }
}