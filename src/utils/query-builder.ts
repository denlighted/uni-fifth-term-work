import {BaseQueryDto} from "../common/dto/query.dto";

export class QueryBuilder {

     constructor(private readonly dto:BaseQueryDto,
    private readonly query ){}

}