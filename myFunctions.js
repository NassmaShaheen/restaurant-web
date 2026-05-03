
$(document).ready(function () {

    // ======================================
    // 1) إظهار / إخفاء تفاصيل الوجبة
    // ======================================
    $('.details-check').on('change', function () {
        var targetId = $(this).data('target');
        if ($(this).is(':checked')) {
            $('#' + targetId).removeClass('hidden').show();
        } else {
            $('#' + targetId).addClass('hidden').hide();
        }
    });


    // ======================================
    // 2) زر "Continue to Order"
    // ======================================
    $('#continueButton').on('click', function () {
        var selectedMeal = $('input[type="radio"]:checked');
        if (selectedMeal.length === 0) {
            alert('الرجاء اختيار وجبة قبل المتابعة.');
            return;
        }
        $('#formContainer').removeClass('hidden').show();
        $('html, body').animate({
            scrollTop: $('#formContainer').offset().top
        }, 600);
    });


    // ========================================
    // 3) التحقق من النموذج وإرساله
    // ========================================
    $('#orderForm').on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var fullName   = $('#fullName').val().trim();
        var nationalId = $('#nationalId').val().trim();
        var birthDate  = $('#birthDate').val().trim();
        var mobile     = $('#mobile').val().trim();
        var email      = $('#email').val().trim();

        // -------- الاسم (اختياري - أحرف عربية فقط) --------
        if (fullName !== '') {
            var nameRegex = /^[\u0621-\u064A\s]+$/;
            if (!nameRegex.test(fullName)) {
                alert('الاسم غير صحيح.\nيجب أن يحتوي على أحرف عربية فقط.');
                $('#fullName').focus();
                return false;
            }
        }

        // -------- الرقم الوطني (إجباري - 11 خانة، أول خانتين 01-14) --------
        if (nationalId === '') {
            alert('الرجاء إدخال الرقم الوطني (إجباري).');
            $('#nationalId').focus();
            return false;
        }
        var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
        if (!nationalIdRegex.test(nationalId)) {
            alert('الرقم الوطني غير صحيح.\nيجب أن يتألف من 11 خانة، وأول خانتين من 01 إلى 14.');
            $('#nationalId').focus();
            return false;
        }

        // -------- تاريخ الميلاد  --------
        var birthDateFormatted = '';
        if (birthDate !== '') {
            var dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            if (!dateRegex.test(birthDate)) {
                alert('تاريخ الميلاد غير صحيح.');
                $('#birthDate').focus();
                return false;
            }
            var enteredDate = new Date(birthDate);
            var todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            if (enteredDate > todayDate) {
                alert('تاريخ الميلاد لا يمكن أن يكون في المستقبل.');
                $('#birthDate').focus();
                return false;
            }
            var parts = birthDate.split('-');
            birthDateFormatted = parts[2] + '-' + parts[1] + '-' + parts[0];
        }

        // -------- رقم الموبايل ( Syriatel / MTN) --------
        if (mobile !== '') {
            var mobileRegex = /^09[345689]\d{7}$/;
            if (!mobileRegex.test(mobile)) {
                alert('رقم الموبايل غير صحيح.\nمثال: 0944123456');
                $('#mobile').focus();
                return false;
            }
        }

        // -------البريد الإلكتروني --------
        if (email !== '') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('البريد الإلكتروني غير صحيح.');
                $('#email').focus();
                return false;
            }
        }

        // ========================================
        // 4) جمع معلومات الوجبة المختارة
        // ========================================
        var selectedMealRadio = $('input[type="radio"]:checked');
        if (selectedMealRadio.length === 0) {
            alert('الرجاء اختيار وجبة من الجدول.');
            return false;
        }

        var mealName  = selectedMealRadio.val();
        var mealRow   = selectedMealRadio.closest('tr');
        var allTds    = mealRow.find('td');
        var mealCode  = allTds.eq(0).text().trim();
        var mealPrice = parseFloat(allTds.eq(2).text().trim());

        var subtotal = mealPrice;
        var tax      = subtotal * 0.05;
        var total    = subtotal + tax;

        // ========================================
        // 5) رسالة منبثقة بتفاصيل الطلب
        // ========================================
        var message = 'تم استلام طلبك بنجاح، شكراً لتعاملك مع مطعمنا الجميل\n';
        message += '------------------------------------------\n';
        message += 'الوجبة المختارة:\n';
        message += mealCode + ' - ' + mealName + ' - ' + mealPrice.toFixed(0) + ' ل.س\n';
        message += '------------------------------------------\n';
        message += 'المجموع الفرعي: ' + subtotal.toFixed(0) + ' ل.س\n';
        message += 'الضريبة المضافة (5%): ' + tax.toFixed(0) + ' ل.س\n';
        message += 'المبلغ النهائي للزبون: ' + total.toFixed(0) + ' ل.س\n';
        message += '------------------------------------------\n';
        message += 'معلومات الزبون:\n';
        if (fullName)           message += 'الاسم: ' + fullName + '\n';
        message += 'الرقم الوطني: ' + nationalId + '\n';
        if (birthDateFormatted) message += 'تاريخ الميلاد: ' + birthDateFormatted + '\n';
        if (mobile)             message += 'رقم الموبايل: ' + mobile + '\n';
        if (email)              message += 'الإيميل: ' + email + '\n';

        alert(message);

        return false;
    });

});