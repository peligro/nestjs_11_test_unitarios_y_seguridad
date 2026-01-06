import { HttpException, HttpStatus } from "@nestjs/common";

export const getException=(mensaje: string)=>
{
    throw new HttpException(
                {
                    estado: HttpStatus.BAD_REQUEST,
                    error:mensaje                    
                },HttpStatus.BAD_REQUEST, 
                {
                    cause:
                    {
                        name:"",
                        message:""
                    }
                }
            );
}