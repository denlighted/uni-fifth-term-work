import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {plainToInstance} from "class-transformer";

@Injectable()

export class TransformNestQueryPipe implements PipeTransform {
    transform(value: any,metadata:ArgumentMetadata) {
        const newValue = {...value};

        Object.keys(value).forEach(key=>{
            const match = key.match(/(\w+)\[(\w+)\]/);
            if(match){
                const [,parent,child] = match;
                if(!newValue[parent]) newValue[parent] = {};
                newValue[parent][child] = value[key];
                delete newValue[key];
            }
        });

        if (metadata.metatype && typeof metadata.metatype === 'function') {
            return plainToInstance(metadata.metatype, newValue);
        }
        return newValue;
    }
}