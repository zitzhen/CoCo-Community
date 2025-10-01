// 控件类型定义
const types = {
    type: "DEVICE_CHECKER_WIDGET", // 控件类型，全局唯一
    icon: "http://q.qlogo.cn/headimg_dl?dst_uin=575244421&spec=640&img_type=jpg", // 控件图标
    title: "垃圾桶-设备检测器1.0", // 控件名称
    isInvisibleWidget: true, // 不可见控件
    isGlobalWidget: true, // 全局控件
    platforms: ["web", "android", "ios"], // 支持的平台
    properties: [], // 无属性
    methods: [
        {
            key: "checkDevice", // 方法名
            label: "检测设备是否匹配", // 方法显示名称
            params: [
                {
                    key: "targetDevice", // 目标设备类型
                    label: "选择要检测的设备", // 参数显示名称
                    valueType: "string", // 参数类型为字符串
                    defaultValue: "android", // 默认值
                    dropdown: [
                        { label: "Android", value: "android" }, // 替换为 "Android"
                        { label: "iOS", value: "ios" },
                        { label: "Windows", value: "windows" },
                        { label: "Mac", value: "mac" },
                        { label: "Linux", value: "linux" }
                    ]
                },
                {
                    key: "trueOutput",
                    label: "匹配时输出",
                    valueType: "string",
                    defaultValue: "true"
                },
                {
                    key: "falseOutput",
                    label: "不匹配时输出",
                    valueType: "string",
                    defaultValue: "false"
                }
            ],
            valueType: "string", // 返回值类型为字符串
            tooltip: "检测当前设备是否与用户选择的设备匹配，并返回自定义的输出值" // 方法说明
        }
    ],
    events: [] // 无事件
};

// 控件实体定义
class DeviceCheckerWidget extends InvisibleWidget {
    constructor(props) {
        super(props);
    }

    // 检测设备类型的方法
    checkDevice(targetDevice, trueOutput = "true", falseOutput = "false") {
        const userAgent = navigator.userAgent.toLowerCase();
        let currentDevice = "unknown";

        if (/android/.test(userAgent)) {
            currentDevice = "android"; // 对应 "Android"
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            currentDevice = "ios";
        } else if (/windows/.test(userAgent)) {
            currentDevice = "windows";
        } else if (/mac os/.test(userAgent)) {
            currentDevice = "mac";
        } else if (/linux/.test(userAgent)) {
            currentDevice = "linux";
        }

        // 比较当前设备与目标设备
        return currentDevice === targetDevice ? trueOutput : falseOutput;
    }
}

// 导出控件类型和实体
exports.types = types;
exports.widget = DeviceCheckerWidget;

// 作者：垃圾桶
