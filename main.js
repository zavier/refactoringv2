
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    // 获取客户信息
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US", 
        {style: "currency", currency: "USD", minimumFractionDigits: 2}).format;
    
    // 获取客户观看的表演信息
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        // 根据类型和观看人数计算收费金额
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }

        // 计算获取的积分
        volumeCredits += Math.max(perf.audience - 30 , 0);
        if ("comedy" === play.type) {
            volumeCredits += Math.floor(perf.audience / 5);
        }

        result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

const inv =  require('./invoices.json');
const p = require('./plays.json');
let res = statement(inv[0], p);
console.log(res);