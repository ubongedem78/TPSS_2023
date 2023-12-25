const computePayment = (req, res) => {
  try {
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

    if (!ID || !Amount || !Currency || !CustomerEmail || !SplitInfo) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const calculateSplit = () => {
      let Balance = Amount;
      console.log("Balance", Balance);
      const splitBreakdown = [];

      // Sort Based on Rule: Flat > Percentage > Ratio
      const sortedSplitInfo = SplitInfo.sort((a, b) => {
        const precedenceOrder = { FLAT: 1, PERCENTAGE: 2, RATIO: 3 };
        return precedenceOrder[a.SplitType] - precedenceOrder[b.SplitType];
      });

      for (const splitEntity of sortedSplitInfo) {
        console.log("splitEntity", splitEntity);

        let splitAmount;

        if (splitEntity.SplitType === "FLAT") {
          splitAmount = splitEntity.SplitValue;
        } else if (splitEntity.SplitType === "PERCENTAGE") {
          splitAmount = (splitEntity.SplitValue / 100) * Balance;
        } else if (splitEntity.SplitType === "RATIO") {
          const totalRatio = sortedSplitInfo
            .filter((item) => item.SplitType === "RATIO")
            .reduce((total, item) => total + item.SplitValue, 0);

          splitAmount = (splitEntity.SplitValue / totalRatio) * Balance;
        }

        Balance -= splitAmount;

        splitBreakdown.push({
          SplitEntityId: splitEntity.SplitEntityId,
          Amount: Balance,
        });
      }

      return { splitBreakdown, Balance };
    };

    const { Balance, splitBreakdown } = calculateSplit();

    return res.status(200).json({
      ID,
      Balance,
      splitBreakdown,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "An error occured": error });
  }
};

module.exports = { computePayment };
