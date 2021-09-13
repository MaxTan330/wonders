# 日历换算

**支持公历转换成农历，回历**

**支持儒略日换算**

**支持生肖，年号，星座转换**

## 安装

    npm install @maxtan/calendar

或者使用 yarn:

    yarn add @maxtan/calendar
	

## 使用

**全部获取**
	
	import { getBaseDate } '@maxtan/calendar';
	console.log(getBaseDate())  //获取当天的相关转换
	console.log(getBaseDate(2021,9,13))  //获取2021年9月13日的相关转换

数据出参
	
	{
	  Ldi: 6, //日
	  Ldc: '初七', //农历日
	  cur_dz: 266, //距离当年冬至日期
	  cur_xz: 84, //距离当年夏至日期
	  cur_lq: 37, //距离当年立秋日期
	  cur_mz: 100, //距离当年芒种日期
	  cur_xs: 68, //距离当年小暑日期
	  Lmc: '八', //农历月
	  Ldn: 29, //农历当月天数，用于判断大小月
	  Lleap: '',//如果为闰，则为闰年
	  Lmc2: '九', //农历月别名
	  Ljq: '',  // 节气
	  jqsj: '', // 节气时间
	  jqjd: -1, // 节气时间 -1 则当天不是节气日
	  jqmc: '', // 节气名称
	  Lyear: 37, // 甲子周期年
	  Lyear0: 37, 
	  Lyear2: '辛丑', // 农历年
	  Lyear3: '辛丑',
	  Lyear4: 4719, // 黄历年
	  Lmonth: 9,
	  Lmonth2: '丁酉', //黄历月名称
	  Lday2: '甲子', //黄历日名称
	  yxjd: -1, // 月相信息 -1 则不是特殊月相日
	  yxmc: '', // 月相名称
	  yxsj: '', // 月相时间
	  Hday: 5, //回历日
	  Hmonth: 2, //回历月
	  Hyear: 1443 // 回历年
	}
	
**儒略日换算**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    lun.getJDCount(2021,9,13) //获取儒略日
    lun.getJD2000Count(2021,9,13) //获取2000年儒略日

**回历换算**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    const hlObj = lun.getHuiLi(lun.getJD2000Count(year, month, day));

**农历换算**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    const lunarObj = lun.getLunarDate(year, month, day);

**获取月相信息**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    const yxObj = lun.getYXInfo(year, month, day);
    
**获取节气信息**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    const jqObj = lun.getJQInfo(year, month, day);

**获取生肖信息**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    lun.getShX(year);

**获取年号信息**

    import { Lunar } '@maxtan/calendar/lunar';
    const lun = new Lunar();
    lun.getNH(year);