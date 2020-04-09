import { IDataContext } from "archdatacore";
import { Collection, Db, ObjectId } from "mongodb";

export interface IMongoDBDataContext extends IDataContext<Db, Collection, ObjectId | string> {
}
