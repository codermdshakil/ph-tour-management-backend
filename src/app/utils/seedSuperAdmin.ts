import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
     console.log("SuperAdmin already exist!!");;
      return;
    }

    console.log("Trying to create SuperAdmin..\n");
    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      parseInt(envVars.BCRYPTJS_SALT_ROUND)
    );

    const authProvider : IAuthProvider = {
      provider:"credentials",
      providerId:envVars.SUPER_ADMIN_EMAIL
    };

    const payload = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
      isVerified:true,
      auths:[authProvider]
    };

    const superAdmin = await User.create(payload);

    console.log(`SuperAdmin created successfully ${superAdmin}`);

  } catch (error) {
    console.log(error);
  }
};
