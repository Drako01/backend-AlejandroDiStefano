import config from "../config/config.js";

export default class PersistenceFactory {
    static getPersistence = async() => {
        switch(config.app.persistence) {
            case "ARRAY":
                let { default: UserDaoArray } = await import ('./userDaoArray.js')
                return new UserDaoArray()
            case "FILE":
                let { default: UserDaoFile } = await import ('./userDaoFile.js')
                return new UserDaoFile()
            case "MONGO":
                let { default: UserDaoBD } = await import ('./userDaoBD.js')
                return new UserDaoBD()
        }
    }
}