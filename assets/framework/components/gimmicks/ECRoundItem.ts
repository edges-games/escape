const {ccclass, property} = cc._decorator;

@ccclass
export default class ECRoundItem extends cc.Component 
{
    @property([cc.Integer]) angles:number[] = [0,45,90,135,180,225,270,315,360];
    @property index:number = 0;
}
