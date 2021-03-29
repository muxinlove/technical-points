// 创建邻接矩阵
class AdjoinMatrix {
  // vertex: Array; // 顶点数组
  // quantity: number; // 矩阵长度
  // adjoinArray: Array; // 矩阵数组
  constructor(vertx) {
    this.vertex = vertx;
    this.quantity = this.vertex.length;
    this.adjoinArray = [];
    this.init();
  }
  // 初始化数组
  init() {
    this.adjoinArray = Array(this.quantity * this.quantity).fill(0);
  }

  /*
   * @param id string
   * @param sides Array
   *  传入一个顶点，和当前顶点可达的顶点数组，将对应位置置为1
   */
  setAdjoinVertexs(id, sides) {
    const pIndex = this.vertex.indexOf(id);
    sides.forEach((item) => {
      const index = this.vertex.indexOf(item);
      this.adjoinArray[pIndex * this.quantity + index] = 1;
    });
  }
  /*
   * @param id string
   * 传入顶点的值，获取该顶点的列
   */
  getVertexCol(id) {
    const index = this.vertex.indexOf(id);
    const col = [];
    this.vertex.forEach((item, pIndex) => {
      col.push(this.adjoinArray[index + this.quantity * pIndex]);
    });
    return col;
  }
  /*
   * @param params Array
   * 传入一个顶点数组，求出该数组所有顶点的列的合
   */
  getColSum(params) {
    const paramsVertex = params.map((id) => this.getVertexCol(id));
    const paramsVertexSum = [];
    this.vertex.forEach((item, index) => {
      const rowtotal = paramsVertex.map((value) => value[index]).reduce((total, current) => {
        total += current || 0; return total;
      }, 0);
      paramsVertexSum.push(rowtotal);
    });
    return paramsVertexSum;
  }
  /*
   *  @param params Array
   * 传入一个顶点数组，求出并集
   */
  getCollection(params) {
    const paramsColSum = this.getColSum(params);
    let collections = [];
    paramsColSum.forEach((item, index) => {
      if (item && this.vertex[index]) collections.push(this.vertex[index]);
    });
    return collections;
  }
  /*
   *  @param params Array
   * 传入一个顶点数组，求出交集
   */
  getUnions(params) {
    const paramsColSum = this.getColSum(params);
    let unions = [];
    paramsColSum.forEach((item, index) => {
      if (item >= params.length && this.vertex[index]) unions.push(this.vertex[index]);
    });
    return unions;
  }
}

// 创建多规格选择邻接矩阵
export default class SpecAdjoinMatrix extends AdjoinMatrix {
  // specList: Array<CommoditySpecsType>;
  // specCombinationList: Array<SpecCategoryType>;
  constructor(specList, specCombinationList) {
    super(specList.reduce((total, current) => [...total, ...current.list], []));
    this.specList = specList;
    this.specCombinationList = specCombinationList;
    // 根据可选规格列表矩阵创建
    this.initSpec();
    // 同级顶点创建
    this.initSameLevel();
  }
  /*
   * 根据可选规格组合填写邻接矩阵的值
      */
  initSpec() {
    this.specCombinationList.forEach((item) => { this.fillInSpec(item.specs); });
  }
  // 填写同级点
  initSameLevel() {
    // 获得初始所有可选项
    const specsOption = this.getCollection(this.vertex);
    this.specList.forEach((item) => {
      const params = [];
      // 获取同级别顶点
      item.list.forEach((value) => { if (specsOption.includes(value)) params.push(value); });
      // 同级点位创建
      this.fillInSpec(params);
    });
  }
  /*
  * 传入顶点数组，查询出可选规格
  * @param params
  */
  getSpecscOptions(params) {
    let specOptionCanchoose = [];
    if (params.some(Boolean)) {
      // 过滤一下选项
      specOptionCanchoose = this.getUnions(params.filter(Boolean));
    } else {
      // 所有可选项
      specOptionCanchoose = this.getCollection(this.vertex);
    }
    return specOptionCanchoose;
  }
  /*
   * @params
   * 填写邻接矩阵的值
   */
  fillInSpec(params) {
    params.forEach((param) => { this.setAdjoinVertexs(param, params); });
  }
}