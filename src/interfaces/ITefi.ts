export interface ITefi<T> {
    result_count: number;
    total_count: string;
    next_offset: number;
    entry_list: Entrylist<T>[];
    relationship_list: any[];
  }
  
  interface Entrylist<T> {
    id: string;
    module_name: string;
    name_value_list: Record<keyof T, NameValue>;
  }
  
  export interface IFtaTefi {
    assigned_user_name: NameValue;
    modified_by_name: NameValue;
    created_by_name: NameValue;
    id: NameValue;
    name: NameValue;
    date_entered: NameValue;
    date_modified: NameValue;
    modified_user_id: NameValue;
    created_by: NameValue;
    description: NameValue;
    deleted: NameValue;
    assigned_user_id: NameValue;
    document_name: NameValue;
    filename: NameValue;
    file_ext: NameValue;
    file_mime_type: NameValue;
    uploadfile: NameValue;
    active_date: NameValue;
    exp_date: NameValue;
    category_id: NameValue;
    subcategory_id: NameValue;
    status_id: NameValue;
    status: NameValue;
    show_preview: NameValue;
    foto_montaje: NameValue;
    fitac_fitac_contacts_name: NameValue;
    nro_oficio_rep_c: NameValue;
    fecha_oficio_c: NameValue;
    link_oficio_c: NameValue;
    fecha_informe_rep_c: NameValue;
    nro_informe_rep_c: NameValue;
    link_informe_rep_c: NameValue;
    fitac_fitac_proy_proyectostele_name: NameValue;
    link_fitac_c: NameValue;
    fecha_ingreso_c: NameValue;
    fitac_v7_c: NameValue;
    fitac_v5_c: NameValue;
    hr_inicial_c: NameValue;
    fitac_v2_c: NameValue;
    fitac_v15_c: NameValue;
    copias_c: NameValue;
    fitac_v14_c: NameValue;
    fitac_v4_c: NameValue;
    tipo_expediente_c: NameValue;
    fitac_v1_c: NameValue;
    account_id_c: NameValue;
    fitac_v8_c: NameValue;
    fitac_v3_c: NameValue;
    fitac_v12_c: NameValue;
    fitac_v10_c: NameValue;
    fitac_v13_c: NameValue;
    fitac_v9_c: NameValue;
    hoja_envio_c: NameValue;
    orden_pedido_c: NameValue;
    parrafo_no_conforme_c: NameValue;
    link_rni_c: NameValue;
    fitac_v6_c: NameValue;
    fitac_v11_c: NameValue;
    copia_muni_c: NameValue;
    link_seia_c: NameValue;
  }
  
 export interface NameValue {
    name: string;
    value: any;
  }