export const editorConfiguration = {
	toolbar: [
		'heading',
		'|',
		'bold',
		'italic',
		'link',
		'bulletedList',
		'numberedList',
		'alignment',
		'|',
		'outdent',
		'indent',
		'|',
		'imageUpload',
		'blockQuote',
		'insertTable',
		'mediaEmbed',
		'undo',
		'redo'
	],
  image: {
    // Configure the available styles.
    

    // Configure the available image resize options.
    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: 'Original',
        value: null
      },
      {
        name: 'resizeImage:50',
        label: '25%',
        value: '25'
      },
      {
        name: 'resizeImage:50',
        label: '50%',
        value: '50'
      },
      {
        name: 'resizeImage:75',
        label: '75%',
        value: '75'
      }
    ],
    styles: [
      'alignLeft', 'alignCenter', 'alignRight'
    ],
    // You need to configure the image toolbar, too, so it shows the new style
    // buttons as well as the resize buttons.
    toolbar: [
      'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
      '|',
      'imageResize',
      '|',
      'imageTextAlternative'
    ]
  },
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
};