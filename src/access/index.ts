import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log(store.state.user.loginUser);
  let loginUser = store.state.user.loginUser;

  //如果没登陆，自动登录
  if (
    !loginUser ||
    !loginUser.userRole ||
    loginUser.userRole == ACCESS_ENUM.NOT_LOGIN
  ) {
    //加awaie是为了等用户登录后再往下执行
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  //不需要登录页面
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    //如果没登陆
    if (!loginUser || !loginUser.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    //如果无权限，跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
    }
  }

  next();
});
