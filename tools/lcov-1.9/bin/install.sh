#!/bin/bash
#
# install.sh [--uninstall] sourcefile targetfile [install options]
#


# Check for uninstall option
if test "x$1" == "x--uninstall" ; then
  UNINSTALL=true
  SOURCE=$2
  TARGET=$3
  shift 3
else
  UNINSTALL=false
  SOURCE=$1
  TARGET=$2
  shift 2
fi

# Check usage
if test -z "$SOURCE" || test -z "$TARGET" ; then
  echo Usage: install.sh [--uninstall] source target [install options] >&2
  exit 1
fi


#
# do_install(SOURCE_FILE, TARGET_FILE)
#

do_install()
{
  local SOURCE=$1
  local TARGET=$2
  local PARAMS=$3

  install -p -D $PARAMS $SOURCE $TARGET
}


#
# do_uninstall(SOURCE_FILE, TARGET_FILE)
#

do_uninstall()
{
  local SOURCE=$1
  local TARGET=$2

  # Does target exist?
  if test -r $TARGET ; then
    # Is target of the same version as this package?
    if diff $SOURCE $TARGET >/dev/null; then
      rm -f $TARGET
    else
      echo WARNING: Skipping uninstall for $TARGET - versions differ! >&2
    fi
  else
    echo WARNING: Skipping uninstall for $TARGET - not installed! >&2
  fi
}


# Call sub routine
if $UNINSTALL ; then
  do_uninstall $SOURCE $TARGET
else
  do_install $SOURCE $TARGET "$*"
fi

exit 0
