const {ccclass, property} = cc._decorator;

@ccclass
export default class RandomActive extends cc.Component {

    @property([cc.Node]) nodes:cc.Node[] = [];

    start () 
    {
        for(let i=0;i<this.nodes.length;i++)
        {
            this.nodes[i].active = false;
        }
        this.nodes[Math.floor(Math.random()*this.nodes.length)].active = true;
    }
}
