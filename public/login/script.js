$(function() {
  $(".btn").click(function() {
  $(".form-signin").toggleClass("form-signin-left");
  $(".form-signup").toggleClass("form-signup-left");
  $(".frame").toggleClass("frame-long");
  $(".signup-inactive").toggleClass("signup-active");
  $(".signin-active").toggleClass("signin-inactive");
  $(".forgot").toggleClass("forgot-left");
  $(this).removeClass("idle").addClass("active");
  });
});

function just_email(str) {
  let email = document.getElementById('email');
  let p = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!p.test(str)) {
      Swal.fire({
          position: 'top-end',
          type: 'error',
          title: 'لطفا یک ایمیل معتبر را وارد کنید.',
          showConfirmButton: false,
          toast: true,
          timer: 4000
      });
      email.value = '';
  }
}

// $(function() {
//   $(".btn-signup").click(function() {
//   $(".nav").toggleClass("nav-up");
//   $(".form-signup-left").toggleClass("form-signup-down");
//   $(".success").toggleClass("success-left");
//   $(".frame").toggleClass("frame-short");
//   });
// });