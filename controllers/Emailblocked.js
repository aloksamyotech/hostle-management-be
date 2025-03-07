import BlockedRole from "../model/Email_shema.js";
export const getBlockmail = async (req, res) => {
  const companyId = req.user._id;
  console.log("respmonse is ===============", companyId);

  const blockedRoles = await BlockedRole.find({ companyId });
  if (!blockedRoles || blockedRoles.length === 0) {
    console.log("something went rong");
  }

  console.log(blockedRoles);
  res.status(200).json(blockedRoles);
};

export const toggerRole = async (req) => {
  const { role, isBlocked } = req.body;
  const companyId = req.user._id;
  let blockedRole = await BlockedRole.findOne({ role, companyId });

  if (blockedRole) {
    blockedRole.isBlocked = isBlocked;
  } else {
    blockedRole = new BlockedRole({ role, isBlocked, companyId });
  }

  await blockedRole.save();
  return blockedRole;
};
