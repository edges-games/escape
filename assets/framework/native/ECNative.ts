const {ccclass, property} = cc._decorator;
/*
Signature    Java Type
Z    boolean
B    byte
C    char
S    short
I    int
J    long
F    float
D    double
V    void
L fully-qualified-class ;    fully-qualified-class
[ type   type[]
*/
export default class ECNative 
{
    static UnityVideoAdCallback = null;
    static InAppPurchaseFinished = null;

    private static callNativeFunction(methodName: string, methodSignature:{android,ios} = {android:"()V",ios:""}, ...parameters:any):any
    {
        if(cc.sys.isMobile)
        {
            if(cc.sys.os == cc.sys.OS_ANDROID)
            {
                if(cc.sys.isNative && jsb)
                {
                    let className = "jp/edges/framework/Native";
                    let androidMethodSignature:string = methodSignature.android;
                    if(parameters)
                    {
                        if(parameters.length == 0)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName,
                                androidMethodSignature);
                        }
                        else if(parameters.length == 1)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName,
                                androidMethodSignature,parameters[0]);
                        }
                        else if(parameters.length == 2)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName,
                                androidMethodSignature,parameters[0],parameters[1]);
                        }
                        else if(parameters.length == 3)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName,
                                androidMethodSignature,parameters[0],parameters[1],parameters[2]);
                        }
                    }
                    else
                    {
                        return jsb.reflection.callStaticMethod(className,methodName,
                            androidMethodSignature);
                    }
                }
            }
            else if(cc.sys.os == cc.sys.OS_IOS)
            {
                if(cc.sys.isNative && jsb)
                {
                    let className = "Native";
                    let iosMethodSignature:string = methodSignature.ios;
                    if(parameters)
                    {
                        if(parameters.length == 0)
                        {
                            return (jsb.reflection.callStaticMethod as any)(className,methodName +
                                iosMethodSignature);
                        }
                        else if(parameters.length == 1)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName+
                                iosMethodSignature,parameters[0]);
                        }
                        else if(parameters.length == 2)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName+
                                iosMethodSignature,parameters[0],parameters[1]);
                        }
                        else if(parameters.length == 3)
                        {
                            return jsb.reflection.callStaticMethod(className,methodName+
                                iosMethodSignature,parameters[0],parameters[1],parameters[2]);
                        }
                    }
                    else
                    {
                        return (jsb.reflection.callStaticMethod as any)(className,methodName+
                        methodSignature);
                    }
                }
            }
        }
        return null;
    }

    static cooperate(json:string)
    {
        this.callNativeFunction("cooperate",{android:"(Ljava/lang/String;)V",ios:":"}, json);
    }

    static vibrate(milliseconds:number)
    {
        this.callNativeFunction("vibrate",{android:"(I)V",ios:":"}, milliseconds);
    }

    static goReview(title: string, content: string, simplified:boolean=false)
    {
        this.callNativeFunction("goReview",{android:"(Ljava/lang/String;Ljava/lang/String;Z)V",ios:":content:simplified:"},title ,content,simplified);
    }

    static shareImage(title: string, content: string, imageUrl:string)
    {
        this.callNativeFunction("shareImage",{android:"(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",ios:":content:imageUrl"},title,content,imageUrl);
    }

    static shareMessage(title: string, content: string)
    {
        this.callNativeFunction("shareMessage",{android:"(Ljava/lang/String;Ljava/lang/String;)V",ios:":content:"},title, content);
    }

    static showUnityVideoAd(callback:any)
    {
        ECNative.UnityVideoAdCallback = callback;
        if(cc.sys.isMobile)
        {
            this.callNativeFunction("showUnityVideoAd");
        }
        else
        {
            ECNative.UnityVideoAdCallback("completed");
        }
    }

    static showUnityBanner()
    {
        this.callNativeFunction("showUnityBanner");
    }

    static hideUnityBanner()
    {
        this.callNativeFunction("hideUnityBanner");
    }

    static showAdmobVideoAd()
    {
        this.callNativeFunction("showAdmobVideoAd");
    }

    static showAdmobBanner()
    {
        this.callNativeFunction("showAdmobBanner");
    }

    static hideAdmobBanner()
    {
        this.callNativeFunction("hideAdmobBanner");
    }

    static showAdmobInterstitial()
    {
        this.callNativeFunction("showAdmobInterstitial");
    }

    static getSystemLanguage() : string
    {
        return this.callNativeFunction("getSystemLanguage",{android:"()Ljava/lang/String;",ios:""});
    }

    static requestNotification(seconds:number, title:string, content:string)
    {
        this.callNativeFunction("requestNotification",{android:"(ILjava/lang/String;Ljava/lang/String;)V",ios:":title:content"},seconds,title,content);
    }

    static querySkuDetails(sku:string):string
    {
        if(cc.sys.isMobile)
        {
            return this.callNativeFunction("querySkuDetails",{android:"(Ljava/lang/String;)Ljava/lang/String;",ios:":"},sku);
        }
        else
        {
            return "{}";
        }
    }

    static querySkuPrice(sku:string,defaultValue:string):string
    {
        if(cc.sys.isMobile)
        {
            let price:string = this.callNativeFunction("querySkuPrice",{android:"(Ljava/lang/String;)Ljava/lang/String;",ios:":"},sku);
            if(price == "NULL")
            {
                return defaultValue;
            }
            return price;
        }
        else
        {
            return defaultValue;
        }
    }

    static launchBillingFlow(sku:string)
    {
        if(cc.sys.isMobile)
        {
            this.callNativeFunction("launchBillingFlow",{android:"(Ljava/lang/String;)V",ios:":"},sku);
        }
        else
        {
            ECNative.InAppPurchaseFinished("completed", sku);
        }
    }
}

window["onUnityVideoAdFinished"] = (result:string)=>
{
    if(ECNative.UnityVideoAdCallback)
    {
        ECNative.UnityVideoAdCallback(result);
        ECNative.UnityVideoAdCallback = null;
    }
    else
    {
        cc.error("There is no callback of Unity video ad");
    }
}

window["onInAppPurchaseFinished"] = (result:string,sku:string)=>
{
    if(ECNative.InAppPurchaseFinished)
    {
        ECNative.InAppPurchaseFinished(result,sku);
    }
    else
    {
        cc.error("There is no callback of Unity video ad");
    }
}
