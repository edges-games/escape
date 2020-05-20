const {ccclass, property} = cc._decorator;
export default class Native 
{
    static UnityVideoAdCallback = null;
    static InAppPurchaseFinished = null;
    static SkuDetailsResponse = null;
    static stopTween(tween:cc.Tween) {
        (tween&& (tween as any)._finalAction.target) && tween.stop();
    }

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
        this.callNativeFunction("vibrate",{android:"(I)V",ios:""}, milliseconds);
    }

    static goReview(title: string, content: string)
    {
        this.callNativeFunction("goReview",{android:"(Ljava/lang/String;Ljava/lang/String;)V",ios:""},title ,content);
    }

    static shareImage(title: string, content: string, imageUrl:string)
    {
        this.callNativeFunction("shareImage",{android:"(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",ios:""},title,content,imageUrl);
    }

    static shareMessage(title: string, content: string)
    {
        this.callNativeFunction("shareMessage",{android:"(Ljava/lang/String;Ljava/lang/String;)V",ios:":content:"},title, content);
    }

    static showUnityVideoAd(callback:any)
    {
        Native.UnityVideoAdCallback = callback;
        if(cc.sys.isMobile)
        {
            this.callNativeFunction("showUnityVideoAd");
        }
        else
        {
            Native.UnityVideoAdCallback("completed");
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

    static showAdmobIntersititial()
    {
        this.callNativeFunction("showAdmobIntersititial");
    }

    static getSystemLanguage() : string
    {
        return this.callNativeFunction("getSystemLanguage",{android:"()Ljava/lang/String;",ios:""});
    }

    static requestNotification(seconds:number, title:string, content:string)
    {
        this.callNativeFunction("requestNotification",{android:"(ILjava/lang/String;Ljava/lang/String;)V",ios:""},seconds,title,content);
    }

    static querySkuDetails(callback:any)
    {
        Native.SkuDetailsResponse = callback;
        if(cc.sys.isMobile)
        {
            this.callNativeFunction("querySkuDetails");
        }
        else
        {
            Native.SkuDetailsResponse("coin");
        }
    }

    static launchBillingFlow(sku:string)
    {
        if(cc.sys.isMobile)
        {
            this.callNativeFunction("launchBillingFlow",{android:"(Ljava/lang/String;)V",ios:""},sku);
        }
        else
        {
            Native.InAppPurchaseFinished("completed", sku);
        }
    }
}

window["onUnityVideoAdFinished"] = (result:string)=>
{
    if(Native.UnityVideoAdCallback)
    {
        Native.UnityVideoAdCallback(result);
        Native.UnityVideoAdCallback = null;
    }
    else
    {
        cc.error("There is no callback of Unity video ad");
    }
}

window["onInAppPurchaseFinished"] = (result:string,sku:string)=>
{
    if(Native.InAppPurchaseFinished)
    {
        Native.InAppPurchaseFinished(result,sku);
    }
    else
    {
        cc.error("There is no callback of Unity video ad");
    }
}

window["onSkuDetailsResponse"] = (result:string)=>
{
    if(Native.SkuDetailsResponse)
    {
        Native.SkuDetailsResponse(result);
        Native.SkuDetailsResponse = null;
    }
    else
    {
        cc.error("There is no callback of Unity video ad");
    }
}

