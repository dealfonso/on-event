current_dir = $(notdir $(shell pwd))
UGLIFY_FLAGS_MIN := $(if $(UGLIFY_FLAGS_MIN),$(UGLIFY_FLAGS_MIN),-m)
DIST_FOLDER := $(if $(DIST_FOLDER),$(DIST_FOLDER),dist)
FILE_NAME := $(if $(FILE_NAME),$(FILE_NAME),$(DIST_FOLDER)/$(current_dir))
build:
	mkdir -p $(DIST_FOLDER)
ifneq ("","$(wildcard js/*.js)")
	uglifyjs -e window,document,$$:window,document,window.$$ js/*.js $(UGLIFY_FLAGS) -b | cat notice - > $(FILE_NAME).js
	uglifyjs -e window,document,$$:window,document,window.$$ js/*.js $(UGLIFY_FLAGS_MIN) | cat notice.min - > $(FILE_NAME).min.js
endif
ifneq ("","$(wildcard css/*.css)")
	cleancss css/*.css --format beautify | cat notice - > $(FILE_NAME).css
	cleancss css/*.css | cat notice.min - > $(FILE_NAME).min.css
endif

clean:
	rm -f $(FILE_NAME).min.js $(FILE_NAME).min.css $(FILE_NAME).js $(FILE_NAME).css
	if [ -d $(DIST_FOLDER) ] && [ -z "$(ls -A $(DIST_FOLDER))" ]; then rm -r $(DIST_FOLDER); fi