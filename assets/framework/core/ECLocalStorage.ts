const {ccclass} = cc._decorator;

@ccclass
export default class ECLocalStorage
{
    private static cache = {};
    private static keys = [];

    public static registSaveKeys(keys:string[])
    {
        ECLocalStorage.keys = keys;
    }

    static contains(a, obj) {
        var i = a.length;
        while (i--) {
           if (a[i] === obj) {
               return true;
           }
        }
        return false;
    }

    public static getSaveKeys(additions:string[]=null)
    {
        if(additions)
        {
            return additions.concat(ECLocalStorage.keys);
        }
        else
        {
            return ECLocalStorage.keys;
        }
    }

    public static setItem(item:string,data:any,autoSave:boolean = false)
    {
        if(!ECLocalStorage.contains(ECLocalStorage.keys,item))
        {
            throw new RangeError("Cant save data for key " + item);
        }
        if(autoSave)
        {
            cc.sys.localStorage.setItem(item,data);
        }
        else
        {
            ECLocalStorage.cache[item] = data;
        }
    }

    public static getItem(item:string)
    {
        return cc.sys.localStorage.getItem(item);
    }

    public static getBooleanItem(item:string, defaultValue:boolean = false):boolean
    {
        let stringValue :string =  cc.sys.localStorage.getItem(item);
        if(stringValue)
        {
            return stringValue == "true";
        }
        else
        {
            return defaultValue;
        }
    }

    public static getIntegerItem(item:string, defaultValue:number = 0):number
    {
        let stringValue :string =  cc.sys.localStorage.getItem(item);
        if(stringValue)
        {
            return parseInt(stringValue);
        }
        else
        {
            return defaultValue;
        }
    }

    public static getFloatItem(item:string, defaultValue:number = 0.0):number
    {
        let stringValue :string =  cc.sys.localStorage.getItem(item);
        if(stringValue)
        {
            return parseFloat(stringValue);
        }
        else
        {
            return defaultValue;
        }
    }

    public static save()
    {
        for (const [key, value] of Object.entries(ECLocalStorage.cache)) {
            cc.sys.localStorage.setItem(key,value);
        }

        ECLocalStorage.cache = {};
    }

    public static clear()
    {
        cc.sys.localStorage.clear();
    }

    public static removeItem(item:string)
    {
        cc.sys.localStorage.removeItem(item);
    }

    public static clearSaveData(except:string[] = [])
    {
        let keys:string[] = ECLocalStorage.getSaveKeys();

        for(let i=0; i < keys.length; i++)
        {
            if(except.includes(keys[i])) continue;
            ECLocalStorage.removeItem(keys[i]);
        }
    }
}
