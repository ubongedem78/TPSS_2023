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
      const splitBreakdown = [];

      // Sort Based on Rule: Flat > Percentage > Ratio
      const sortedSplitInfo = SplitInfo.sort((a, b) => {
        const precedenceOrder = { Flat: 1, Percentage: 2, Ratio: 3 };
        return precedenceOrder[a.SplitType] - precedenceOrder[b.SplitType];
      });

      for (const splitEntity of sortedSplitInfo) {
        let splitAmount;

        if (splitEntity.SplitType === "Flat") {
          splitAmount = splitEntity.SplitValue;
        } else if (splitEntity.SplitType === "Percentage") {
          splitAmount = (splitEntity.SplitValue / 100) * Balance;
        } else if (splitEntity.SplitType === "Ratio") {
          const totalRatio = sortedSplitInfo
            .filter((item) => {
              item.splitType === "Ratio";
            })
            .reduce((total, item) => {
              total + item.Splitvalue, 0;
            });
          splitAmount = (splitEntity.SplitValue / totalRatio) * Balance;
        }

        Balance -= splitAmount;
        splitBreakdown.push({
          splitEntityId: splitEntity.SplitEntityId,
          Amount: splitAmount,
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
