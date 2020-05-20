import ECItemBoxLayer from "./ECItemBoxLayer";

const {ccclass} = cc._decorator;

@ccclass
export default class ECItemPageButton extends cc.Component {

    public page:number = 0;
    public itemBox:ECItemBoxLayer;

    onSelectPage()
    {
        this.itemBox.changePage(this.page);
    }
}
