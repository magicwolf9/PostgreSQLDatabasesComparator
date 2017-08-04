import * as config from 'config';
import {pgService} from "../../globals";

const defaultSchema = config.get('defaultSchema');

/*export interface ExampleTableRow{
    colOne: string;
    colTwo: string;
}*/


export class KassaTestModel {
    // [{colOne: '', colTwo: ''}, ];
    static async getAll(tableName: string): Promise<Array<any>> {

        return [
            {
                extra_code: "ISSUE_DATE",
                extra_name: "ДАТА ВЫДАЧИ ПАСПОРТА"
            },
            {
                extra_code: "ISSUED_BY",
                extra_name: "КЕМ ВЫДАН"
            },
            {
                extra_code: "KPP",
                extra_name: "КПП"
            },
            {
                extra_code: "CHIEF_ISSUE_DATE",
                extra_name: "ДАТА ВЫДАЧИ ПАСПОРТА РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_ISSUED_BY",
                extra_name: "КЕМ ВЫДАН ПАСПОРТ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "OGRN",
                extra_name: "ОГРН"
            },
            {
                extra_code: "OKPO",
                extra_name: "ОКПО"
            },
            {
                extra_code: "MAIL_ADDR",
                extra_name: "ПОЧТОВЫЙ АДРЕС"
            },
            {
                extra_code: "CHIEF_BIRTHDATE",
                extra_name: "ДАТА РОЖДЕНИЯ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "BIC",
                extra_name: "БИК"
            },
            {
                extra_code: "OPER_ACCOUNT",
                extra_name: "РАСЧЕТНЫЙ СЧЕТ"
            },
            {
                extra_code: "CORR_ACCOUNT",
                extra_name: "КОРРЕСПОНДЕНТСКИЙ СЧЕТ"
            },
            {
                extra_code: "BANK_NAME",
                extra_name: "НАЗВАНИЕ БАНКА"
            },
            {
                extra_code: "FORM_OF_INCORPORATION",
                extra_name: "ОРГАНИЗАЦИОННО-ПРАВОВА ФОРМА"
            },
            {
                extra_code: "ACTUAL_ADDR",
                extra_name: "ФАКТИЧЕСКИЙ АДРЕС"
            },
            {
                extra_code: "LEGAL_ADDR",
                extra_name: "ЮРИДИЧЕСКИЙ АДРЕС"
            },
            {
                extra_code: "COINCIDE_WITH_LEGAL",
                extra_name: "ФАКТИЧЕСКИЙ АДРЕС СОВПАДАЕТ С ЮРИДИЧЕСКИМ"
            },
            {
                extra_code: "CHIEF_SURNAME",
                extra_name: "ФАМИЛИЯ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "REPRESENTATIVE_PHONE",
                extra_name: "ТЕЛЕФОН ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "REPRESENTATIVE_EMAIL",
                extra_name: "ПОЧТОВЫЙ АДРЕС ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "PARTNER_NAME",
                extra_name: "ЮРИДИЧЕСКОЕ НАИМЕНОВАНИЕ КОМПАНИИ"
            },
            {
                extra_code: "SITE_PURPOSE",
                extra_name: "ПЕРЕЧЕНЬ ТОВАРОВ"
            },
            {
                extra_code: "REPRESENTATIVE_NAME",
                extra_name: "ИМЯ ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "REPRESENTATIVE_SURNAME",
                extra_name: "ФАМИЛИЯ ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "REPRESENTATIVE_PATRONYMIC",
                extra_name: "ОТЧЕСТВО ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "CHIEF_PASSPORT_NUMB",
                extra_name: "НОМЕР ПАСПОРТА РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_PATRONYMIC",
                extra_name: "ОТЧЕСТВО РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "REGISTRATION_AUTHORITY",
                extra_name: "РЕГИСТРИРУЮЩИЙ ОРГАН"
            },
            {
                extra_code: "REGISTRATION_DATE",
                extra_name: "ДАТА РЕГИСТРАЦИИ"
            },
            {
                extra_code: "REGISTRATION_CITY",
                extra_name: "ГОРОД РЕГИСТРАЦИИ"
            },
            {
                extra_code: "CHIEF_NAME",
                extra_name: "ИМЯ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_BIRTHPLACE",
                extra_name: "МЕСТО РОЖДЕНИЕ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_PASSPORT_SER",
                extra_name: "СЕРИЯ ПАСПОРТА РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "COINCIDE_WITH_CHIEF",
                extra_name: "КОНТАКТНЫМ ЛИЦОМ ЯВЛЯЕТСЯ РУКОВОДИТЕЛЬ"
            },
            {
                extra_code: "DEPARTMENT_CODE",
                extra_name: "КОД ПОДРАЗДЕЛЕНИЯ"
            },
            {
                extra_code: "MARKETING_CATEGORY_ID",
                extra_name: "НОМЕР МАРКЕТИНГОВОЙ КАТЕГОРИИ"
            },
            {
                extra_code: "MARKETING_CATEGORY_NAME",
                extra_name: "МАРКЕТИНГОВАЯ КАТЕГОРИЯ"
            },
            {
                extra_code: "MARKETING_CATEGORY",
                extra_name: "МАРКЕТИНГОВАЯ КАТЕГОРИЯ"
            },
            {
                extra_code: "CONTRACT_NUMBER",
                extra_name: "НОМЕР ДОГОВОРА"
            }
        ];

        //return await pgService.getRows(`SELECT * FROM ${defaultSchema}.example_table`);

        // return await pgService.getRows(`SELECT columnOne, columnTwo FROM ${defaultSchema}.example_table`);
    }

    static async getAll1(tableName: string): Promise<Array<any>> {

        return await [
            {
                extra_code: "MERCHANT_SITE_EXTERNAL_ID",
                extra_name: "ИДЕНТИФИКАТОР САЙТА"
            },
            {
                extra_code: "ISSUE_DATE",
                extra_name: "ДАТА ВЫДАЧИ ПАСПОРТА"
            },
            {
                extra_code: "ISSUED_BY",
                extra_name: "КЕМ ВЫДАН"
            },
            {
                extra_code: "KPP",
                extra_name: "КПП"
            },
            {
                extra_code: "CHIEF_ISSUE_DATE",
                extra_name: "ДАТА ВЫДАЧИ ПАСПОРТА РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_ISSUED_BY",
                extra_name: "КЕМ ВЫДАН ПАСПОРТ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "OGRN",
                extra_name: "ОГРН"
            },
            {
                extra_code: "OKPO",
                extra_name: "ОКПО"
            },
            {
                extra_code: "MAIL_ADDR",
                extra_name: "ПОЧТОВЫЙ АДРЕС"
            },
            {
                extra_code: "CHIEF_BIRTHDATE",
                extra_name: "ДАТА РОЖДЕНИЯ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "BIC",
                extra_name: "БИК"
            },
            {
                extra_code: "OPER_ACCOUNT",
                extra_name: "РАСЧЕТНЫЙ СЧЕТ"
            },
            {
                extra_code: "CORR_ACCOUNT",
                extra_name: "КОРРЕСПОНДЕНТСКИЙ СЧЕТ"
            },
            {
                extra_code: "BANK_NAME",
                extra_name: "НАЗВАНИЕ БАНКА"
            },
            {
                extra_code: "FORM_OF_INCORPORATION",
                extra_name: "ОРГАНИЗАЦИОННО-ПРАВОВА ФОРМА"
            },
            {
                extra_code: "ACTUAL_ADDR",
                extra_name: "ФАКТИЧЕСКИЙ АДРЕС"
            },
            {
                extra_code: "LEGAL_ADDR",
                extra_name: "ЮРИДИЧЕСКИЙ АДРЕС"
            },
            {
                extra_code: "COINCIDE_WITH_LEGAL",
                extra_name: "ФАКТИЧЕСКИЙ АДРЕС СОВПАДАЕТ С ЮРИДИЧЕСКИМ"
            },
            {
                extra_code: "CHIEF_SURNAME",
                extra_name: "ФАМИЛИЯ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "REPRESENTATIVE_PHONE",
                extra_name: "ТЕЛЕФОН ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "REPRESENTATIVE_EMAIL",
                extra_name: "ПОЧТОВЫЙ АДРЕС ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "PARTNER_NAME",
                extra_name: "ЮРИДИЧЕСКОЕ НАИМЕНОВАНИЕ КОМПАНИИ"
            },
            {
                extra_code: "SITE_PURPOSE",
                extra_name: "ПЕРЕЧЕНЬ ТОВАРОВ"
            },
            {
                extra_code: "REPRESENTATIVE_NAME",
                extra_name: "ИМЯ ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "REPRESENTATIVE_SURNAME",
                extra_name: "ФАМИЛИЯ ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "REPRESENTATIVE_PATRONYMIC",
                extra_name: "ОТЧЕСТВО ПРЕДСТАВИТЕЛЯ (КОНТАКТНОЕ ЛИЦО)"
            },
            {
                extra_code: "CHIEF_PASSPORT_NUMB",
                extra_name: "НОМЕР ПАСПОРТА РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_PATRONYMIC",
                extra_name: "ОТЧЕСТВО РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "REGISTRATION_AUTHORITY",
                extra_name: "РЕГИСТРИРУЮЩИЙ ОРГАН"
            },
            {
                extra_code: "REGISTRATION_DATE",
                extra_name: "ДАТА РЕГИСТРАЦИИ"
            },
            {
                extra_code: "REGISTRATION_CITY",
                extra_name: "ГОРОД РЕГИСТРАЦИИ"
            },
            {
                extra_code: "CHIEF_NAME",
                extra_name: "ИМЯ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_BIRTHPLACE",
                extra_name: "МЕСТО РОЖДЕНИЕ РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "CHIEF_PASSPORT_SER",
                extra_name: "СЕРИЯ ПАСПОРТА РУКОВОДИТЕЛЯ"
            },
            {
                extra_code: "COINCIDE_WITH_CHIEF",
                extra_name: "КОНТАКТНЫМ ЛИЦОМ ЯВЛЯЕТСЯ РУКОВОДИТЕЛЬ"
            },
            {
                extra_code: "DEPARTMENT_CODE",
                extra_name: "КОД ПОДРАЗДЕЛЕНИЯ"
            },
            {
                extra_code: "MARKETING_CATEGORY_ID",
                extra_name: "НОМЕР МАРКЕТИНГОВОЙ КАТЕГОРИИ"
            },
            {
                extra_code: "MARKETING_CATEGORY_NAME",
                extra_name: "МАРКЕТИНГОВАЯ КАТЕГОРИЯ"
            },
            {
                extra_code: "MARKETING_CATEGORY",
                extra_name: "МАРКЕТИНГОВАЯ КАТЕГОРИЯ"
            }
        ];


        //return await pgService.getRows(`SELECT * FROM ${defaultSchema}.example_table`);

        // return await pgService.getRows(`SELECT columnOne, columnTwo FROM ${defaultSchema}.example_table`);
    }


}