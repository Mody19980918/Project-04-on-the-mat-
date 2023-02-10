import { Rule } from "../global/Model";

export function genValidator(rules: Array<Rule>) {
  return (value: any) => {
    let reasons = rules
      .filter((rule) => rule.match(value))
      .map((rule) => <div key={rule.reason}>{rule.reason}</div>);
    return reasons.length == 0 ? null : reasons;
  };
}
